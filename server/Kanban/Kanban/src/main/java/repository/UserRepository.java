package repository;

import models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository                                 //nazwa encji(tabeli), typ klucza podstawowego
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    User findByFirstName(String firstName);
    void deleteByEmail(String email);
}
